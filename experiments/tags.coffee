data = require '../devpostdump.json'
group = require 'group-array'

tags = []

for hack in data
    for tag in hack.tags
        tags.push tag

uniques = []

for tag in tags
    if uniques.indexOf tag == -1
        uniques.push tag

for tag in uniques
    console.log(tag +" " + (tags.filter (x) -> x == tag).length)


