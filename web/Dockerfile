FROM python:3.9-slim

RUN apt-get update && apt-get install

RUN apt-get install -y dos2unix
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc g++ libgdal-dev libffi-dev vim nano postgresql-client \
    && rm -rf /var/lib/apt/lists/*

RUN python -m pip install --upgrade pip

WORKDIR /my-app/

COPY . /my-app
RUN python -m pip install -r requirements.txt

RUN dos2unix /my-app/entrypoint.sh

ENTRYPOINT ["bash", "/my-app/entrypoint.sh"]

