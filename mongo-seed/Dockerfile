FROM mongo

COPY devpostdump.json /devpostdump.json
CMD mongoimport --host db --db deephack --collection hacks --type json --file ./devpostdump.json

