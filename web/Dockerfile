FROM python:3.7-slim

RUN apt-get update && apt-get install

RUN apt-get install -y libmariadb-dev-compat libmariadb-dev
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc \
    && rm -rf /var/lib/apt/lists/*

RUN python -m pip install --upgrade pip
RUN mkdir -p /app/

WORKDIR /app/

COPY requirements.txt requirements.txt
RUN python -m pip install -r requirements.txt

COPY . /app/ 

