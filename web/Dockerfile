FROM python:3.8-slim

RUN apt-get update && apt-get install

RUN apt-get install -y dos2unix
RUN apt-get install -y libpq-dev python-dev
RUN apt-get install -y python3-psycopg2
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc \
    && rm -rf /var/lib/apt/lists/*

RUN python -m pip install --upgrade pip

WORKDIR /my-app/

COPY requirements.txt requirements.txt
COPY entrypoint.sh entrypoint.sh
RUN python -m pip install -r requirements.txt

RUN dos2unix /my-app/entrypoint.sh

ENTRYPOINT ["bash", "/my-app/entrypoint.sh"]

