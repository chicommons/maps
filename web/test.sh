#!/bin/bash
echo $DYLD_LIBRARY_PATH

echo $DYLD_LIBRARY_PATH
source ./venv/bin/activate
python manage.py migrate maps
