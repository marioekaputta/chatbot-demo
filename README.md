# Bahasa.ai Bot Framework

Bot Framework is used to adjust the functionality of your chatbot. So, you don't have to install it if you make a simple chatbot. You can also collaborate on the repository: https://github.com/bahasa-ai/bot-framework

0. Requirements

 - Git

1. Initialize

You can initialize git repository by git init or clone from a repository. And add remote upstream:

```
git remote add upstream git@github.com:bahasa-ai/bot-framework.git
```

Or with HTTPS:

```
git remote add upstream https://github.com/bahasa-ai/bot-framework.git
```

2. Update

Merge the framework to your origin repo --or if there is an update from the framework-- You can update by run:

```
git pull upstream master    # or you can get from other branch eg. experiment
git merge upstream/master --allow-unrelated-histories
```

3. Setup config

Run `cp .env.example .env` and update your .env file by your agent data. See `./src/Config.ts` to see the details.