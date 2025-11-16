# keep-list-cleaner

AWS Lambda function that regularly cleans a Google Keep shopping list

## Prerequisites

1. Install the [AWS CDK CLI](https://docs.aws.amazon.com/cdk/v2/guide/getting-started.html)
2. Install [Docker](https://docs.docker.com/get-started/get-docker/)

## Deployment

### Get Google auth token

These steps are based on the steps from gkeepapi's [Authenticating](https://gkeepapi.readthedocs.io/en/latest/#authenticating) docs and gpsoauth's [README](https://github.com/simon-weber/gpsoauth#alternative-flow).

1. Go to https://accounts.google.com/EmbeddedSetup and log in. Agree to the terms. The page will get stuck infinitely loading. That's okay.

2. Copy the value of the `oauth_token` cookie.

3. Run the following script. Input your email address, the `oauth_token` value, and `0123456789abcdef` for the Android token.

    ```sh
    docker run --rm -it --entrypoint //bin/sh python:3 -c 'pip install gpsoauth; python3 -c '\''print(__import__("gpsoauth").exchange_token(input("Email: "), input("OAuth Token: "), input("Android ID: ")))'\'
    ```

4. The script will print a Python dict with the key `"Token"`. Copy the token value.

### Set up environment variables

```sh
export GOOGLE_EMAIL="somebody@gmail.com"
export GOOGLE_MASTER_TOKEN="<token from earlier>"
export KEEP_NOTE_ID="<note id>" # Get it from the Keep URL
```

### Deploy to CloudFormation

```sh
cdk synth
cdk deploy
```
