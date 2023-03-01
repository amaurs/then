import React, { Fragment, useContext, useState, useEffect } from 'react';
import CSS from "csstype";
import { useParams } from "react-router-dom";

import ReactMarkdown from 'react-markdown';

interface Props {
    url: string;
}

const Post = (props: Props) => {
    const [content, setContent] = useState("");
    const { slug } = useParams();

    useEffect(() => {
        let cancel = false;
        const fetchPost = async (url: string) => {
            try {
                let payload = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                let response = await fetch(url, payload);
                let json = await response.json();
                
                if (!cancel) {
                    console.log(json["url"]);

                    fetch(json["url"])
                      .then((res) => res.text())
                      .then((text) => setContent(text));


                }
            } catch (error) {
                console.log("Call to post endpoint failed.", error)
            }
        }
        fetchPost(`${props.url}/${slug}`);
        return () => {
            cancel = true
        };
    }, [props.url]);

    return <Fragment>
               <ReactMarkdown children={content} />
           </Fragment>;
}

export default Post;
