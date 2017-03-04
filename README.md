# DeepHack
An deep learning system that will decide the best and easiest way to win some Hackathon swag

![DeepHack](web/static/brainlogo.png)

# What is it?
DeepHack is a system based on big data analysis and deep learning with the focus of analysing the current hackathon scene. The main feature is the big data analysis based on over sixty thousand 'hacks' all hosted on Devpost.

# How it works?
We built a web scrapper that scrapes all hacks from Devpost and later on parses all that data in an incredible small JSON, this JSON is imported in a mongo database, where we use aggregations and various methods of data analysis to find out correlations between various data. This Json is also fed into a Tensorflow model built by us Using a triple input with 5 biases to calculate what we call a DeepHack score, this score is supposed to approximate the amount of prizes one hack will win at a hackathon. At the current state we have around 75% accuracy on our predictions. However we believe we could easily increase this value to over 84% without a lot of work. However working with big data requires incredible amounts of time.

# The problems
The hackathon went fairly easily. However we faced many big data problems along the way, waiting for over an hour for scrappers and parsers to run and even reaching a peak of over 80GB or RAM in use by a single process in our processing server.
