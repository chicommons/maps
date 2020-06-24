FROM python:3.7-slim

RUN apt-get update && apt-get install

RUN apt-get install -y libmariadb-dev-compat libmariadb-dev
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc \
    && rm -rf /var/lib/apt/lists/*
#RUN apt-get install libgdal-dev
RUN apt-get update &&\
    apt-get install -y binutils libproj-dev gdal-bin
RUN export CPLUS_INCLUDE_PATH=/usr/include/gdal
RUN export C_INCLUDE_PATH=/usr/include/gdal


RUN python -m pip install --upgrade pip

WORKDIR /app/

COPY requirements.txt requirements.txt
RUN python -m pip install -r requirements.txt

ENTRYPOINT ["bash", "/app/entrypoint.sh"]

