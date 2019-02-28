# DeepHack
An deep learning system that will decide the best and easiest way to win some Hackathon swag. Check it out at [deephack.jnthn.uk](http://deephack.jnthn.uk).

![deephack](/screenshot.png)

# What is it?
DeepHack is a system based on big data analysis and deep learning with the focus of analysing the current hackathon scene. The main feature is the big data analysis based on over sixty thousand 'hacks' all hosted on Devpost.

# How it works?
We built a web scrapper that scrapes all hacks from Devpost and later on parses all that data in an incredible small JSON, this JSON is imported in a mongo database, where we use aggregations and various methods of data analysis to find out correlations between various data. This Json is also fed into a Tensorflow model built by us Using a triple input with 5 biases to calculate what we call a DeepHack score, this score is supposed to approximate the amount of prizes one hack will win at a hackathon. At the current state we have around 75% accuracy on our predictions. However we believe we could easily increase this value to over 84% without a lot of work. However working with big data requires incredible amounts of time.

# The problems
The hackathon went fairly easily. However we faced many big data problems along the way, waiting for over an hour for scrappers and parsers to run and even reaching a peak of over 80GB or RAM in use by a single process in our processing server.

# To get running
To start the project with the data that is already in the repo, uncomment the `mongo-seed` in `docker-compose.yml`. Run `docker-compose up` and wait for the data to be inserted into the db. Then stop docker and uncomment the `mongo-seed` image again.

The project is now ready to run with `docker-compose run`.

# To update the data
The project is most useful when the latest data is used. First you will need to download a copy of all the projects. To do this run the `dump.py` script in the scraper directory (takes about 2 hours). Then run the `parse_dump.py` to extract the latest data (takes about 20 mins). You will be left with a `devpostdump.json` file. Insert this into the mongo database using the mongo-seed image (be careful not to get duplicated data though so make sure to drop the db every time you change the data).


