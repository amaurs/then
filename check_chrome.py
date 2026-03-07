#!/usr/bin/env python3
import json, requests, websocket, time

tabs = requests.get('http://localhost:9222/json').json()
ws_url = tabs[0]['webSocketDebuggerUrl']
current_url = tabs[0].get('url', '')

ws = websocket.create_connection(ws_url, origin="http://localhost:5173")
msg_id = 0

def send(method, params=None):
    global msg_id
    msg_id += 1
    msg = {"id": msg_id, "method": method}
    if params:
        msg["params"] = params
    ws.send(json.dumps(msg))
    return msg_id

def recv_until(target_id, timeout=10):
    end = time.time() + timeout
    events = []
    while time.time() < end:
        ws.settimeout(max(0.1, end - time.time()))
        try:
            data = json.loads(ws.recv())
            if data.get("id") == target_id:
                return data, events
            events.append(data)
        except websocket.WebSocketTimeoutException:
            break
    return None, events

# Enable Console and Page
send("Console.enable")
send("Page.enable")
rid = send("Runtime.enable")
recv_until(rid)

# Navigate if not already on the page
if "localhost:5173" not in current_url:
    rid = send("Page.navigate", {"url": "http://localhost:5173/"})
    recv_until(rid)
    time.sleep(3)
else:
    # Reload to capture fresh console messages
    rid = send("Page.reload")
    recv_until(rid)
    time.sleep(3)

# Collect console errors from events
print("=== 1) JavaScript Console Errors ===")
# Use Runtime.evaluate to check for errors via a fresh approach
rid = send("Runtime.evaluate", {
    "expression": """
    (function() {
        // Check if there are any error-level entries in performance/resource timing
        var errors = [];
        // Try to get any unhandled errors from window.onerror
        return JSON.stringify(errors);
    })()
    """,
    "returnByValue": True
})
result, events = recv_until(rid)

# Check events for console errors
console_errors = []
for evt in events:
    if evt.get("method") == "Console.messageAdded":
        msg = evt["params"]["message"]
        if msg.get("level") in ("error", "warning"):
            console_errors.append(f"[{msg['level']}] {msg.get('text', '')}")
    elif evt.get("method") == "Runtime.consoleAPICalled":
        if evt["params"].get("type") == "error":
            args = evt["params"].get("args", [])
            text = " ".join(a.get("value", a.get("description", "")) for a in args)
            console_errors.append(f"[error] {text}")
    elif evt.get("method") == "Runtime.exceptionThrown":
        exc = evt["params"].get("exceptionDetails", {})
        text = exc.get("text", "")
        if exc.get("exception"):
            text += " " + exc["exception"].get("description", "")
        console_errors.append(f"[exception] {text}")

if console_errors:
    print(f"  Found {len(console_errors)} error(s):")
    for e in console_errors:
        print(f"    - {e}")
else:
    print("  ✓ No JavaScript errors found in console")

# Check #root div content
print("\n=== 2) #root div Content Check ===")
rid = send("Runtime.evaluate", {
    "expression": """
    (function() {
        var root = document.getElementById('root');
        if (!root) return JSON.stringify({exists: false, empty: true, length: 0, preview: ''});
        var html = root.innerHTML.trim();
        return JSON.stringify({
            exists: true,
            empty: html === '',
            length: html.length,
            childCount: root.children.length,
            preview: html.substring(0, 500)
        });
    })()
    """,
    "returnByValue": True
})
result, more_events = recv_until(rid)

# Also check these events for errors
for evt in more_events:
    if evt.get("method") == "Runtime.exceptionThrown":
        exc = evt["params"].get("exceptionDetails", {})
        text = exc.get("text", "")
        console_errors.append(f"[exception] {text}")

if result and "result" in result:
    val = result["result"].get("result", {})
    if val.get("type") == "string":
        info = json.loads(val["value"])
        if not info["exists"]:
            print("  ✗ #root div does NOT exist in the DOM")
        elif info["empty"]:
            print("  ✗ #root div exists but is EMPTY")
        else:
            print(f"  ✓ #root div has rendered content")
            print(f"    - innerHTML length: {info['length']} characters")
            print(f"    - Child elements: {info['childCount']}")
            print(f"    - Preview: {info['preview'][:200]}...")
    else:
        print(f"  Unexpected result type: {val}")
else:
    print("  Failed to evaluate #root content")

ws.close()

print("\n=== SUMMARY ===")
print(f"Console errors: {len(console_errors)} found" if console_errors else "Console errors: None ✓")
print(f"#root rendered: {'Yes ✓' if result else 'Unknown'}")
