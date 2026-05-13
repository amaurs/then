# The Depressive Bot

My infatuation with chatbots started back in college when I learned about Eliza. It was a natural language processing program created during the sixties that simulated the interaction with a psychotherapist. It was the first program to give it a shot at attempting the Turing test and the ideas behind it keep relevant to this day.

This first approach was a source of inspiration and got me interested in chatbots and automatic text generation. Using the tools I knew at the time I wrote a simple script that was capable of joining part of speech into simple sentences and publish them using the Twitter API. The content, however, was dull and monotonous.

## Inception

A few years later, I learned how to generate random text using Markov chains and got instantly hooked. Unlike my previous effort, the text generated using this approach seemed more organic. I decided to un-dust my old project and give it a new spin, instead of twitting random sentences I would gather a corpus and train the Markov model on it. The inspiration for the corpus, and the character which gave the project a name came from Marvin, the paranoid android from Hitchhiker’s Guide to the Galaxy.

Top Articles on How Businesses are using Bots:

1. Revenue models for bots and chatbots

2. WhatsApp for Business: A Beginners Guide

3. Why Messenger is the Ideal Bot Platform for Now

4. Series of stories on AI, chatbots and how can they help businesses

Soon I realized that quotes from one single character made the model too predictive, so I needed more data to feed the Markov chain. A quick dive into IMDb looking for quotes from robots popular movies was enough to come with a decent corpus. After manual curation, I had a text file including notable quotes from our metallic buddies. Using only two dependencies, tweepy and markovify, I was able to pull this out with minimal effort and the depressive bot was born.

The next step was to upload the script to a server and execute it every now and then to simulate real Twitter activity. The solution that came to mind was to set up a cron job that triggered the script, but the result was too rigid, it felt quite unnatural that the bot was tweeting at the same exact hour every day. The solution was to set up the script as a service that was idle for irregular intervals. Each time that the process tweeted, it would sleep for a random amount of time ranging between one hour and one day, only to wake up and repeat the same again. Using supervisord the process re-spawn every time anything went wrong. With this solution, the depressive bot kept tweeting for years without ever having to make sure it was still running. Simple solutions usually work best.

## Coming of Age

Trying to keep myself up to date and riding the serverless wave, I decided that it was a good time to give my little friend a makeover. Given that the nature of AWS lambdas is to behave as ephemeral containers that come up on demand, it sounded like the right tool for the job. That assumption ended up to be correct, but not without some difficulties down the way.

The first problem that I found was mimicking the way the process was creating new tweets. The lambda container life span is short, so the process couldn’t just run forever and wake up sometimes. Another thing to consider is that the lambda function must be stateless, executions don’t have any information about previous ones so the bot won’t know when was the last time it was active. Finally, I wanted to learn how to use other AWS tools that might come in handy in future projects.

With these limitations in mind, I tried some solutions which I describe next.

## Like Clockwork

Among the triggers that can activate a lambda function, we have CloudWatch Events. They can be scheduled to run with the same syntax as the cron jobs. The problem was that I ended up in the same scenario that I was trying to avoid originally: scheduled tweeting. I figured out that I could transfer the randomness to the lambda execution if every time the function was called there was a p probability of not doing anything (sleeping) against a 1-p probability of performing the action (tweeting). With this idea I was able to mimic the previous behavior with one major drawback, it would be needed to call the function constantly to simulate any complex behavior. For example, if we call the lambda every minute, and make the process sleep 99.8% of the time then we have a mean of about 3 tweets per day. Needless to say, this is a total waste of resources with 86,400 calls a day. Even though functions calls are relatively cheap, it was just ridiculous. The depressive bot deserved better.

## Trial and Error

I thought that I could bring in the cool toys and I tried to train a reinforcement learning model. Should be simple right? model the environment, simulate a few thousand years to train a Q-Learning agent and voila! Oh, boy was I wrong… while in the paper this seemed feasible, it was not very clear when to end the episodes and therefore, it was not very clear when was the model supposed to learn. It was also very hard to prevent the agent from becoming greedy and just tweet all the time. Also, given the random component of time, the agent didn’t actually have control of what state will it jump next. Giving it a fixed number of tweets a day and a negative reward every time it ran out of tweets didn’t help either. This was definitely not a solution and simpler things were at hand. I dismissed this idea after a few unsuccessful models.

## Back to the Drawing Board

The solution ended up to be right there in front of me. It turns out that using boto3 you can edit the schedule for the CloudWatch event, and it also turns out that the lambda execution can be allowed to perform boto3 calls if the right permissions are assigned to its role. So in the same way as the service version of the chatbot had control on how long would it sleep before its next tweet, the lambda version can modify the CloudWatch event to trigger the next execution. In other words, the lambda function can control its own schedule.

## The Environment to the Rescue

To make the behavior even more realistic I added a blacklist of hours in which the bot should not tweet, if the function is called during this hours, the process will do nothing but setting up the next execution. Additionally, I figured out that making changes to the corpus would be dead simple if I hosted it in a bucket in S3 and make the process download it every time the tweet action was selected. This way if I want to add more text to the corpus I just need to update the file to the bucket and it will simply work. All the other parameters are also configurable via environment variables: the Twitter credentials, the bucket that hosts the corpus, the sleep hours, and also the parameters for probability distribution from which the sleeping time is drawn.

Additionally, every time the function activates it emits a metric to CloudWatch. This lets me monitor how many times did the function was invoked, and which of those ended up in tweets.

## A Glimpse into the Future

I love to revisit old projects when I consider that they are a good fit for a new technology that I am working with at the moment. It is always more fun to learn by doing and is easier to work with ideas that I have already digested. An interesting feature that I would like to try next would be replacing the Markov chain model with an LSTM network. For now, I will leave him alone enjoying his current life form.

The depressive bot is alive, long live the depressive bot!
