fs   = require 'fs'
data = require './output/devpostdump.json'
# data = require './devpostdump.json'

console.log "Project count =" + data.length

rate = (likes,comments,tags) ->
    values = [-0.17166938, 0.17166938, -1.0890068, 0.40597844, 0.8478532721967487]
    z = values[0]
    x = values[1]
    a = values[2]*2
    b = values[3]*2
    c = values[4]*2
    return z*(x*((a * likes) + (b * comments)) + (c*c * tags))


correct = 0
for hack in data
    # console.log hack.name
    # console.log "Predicted " + Math.round(rate(hack.num_likes*2, hack.num_comments*2,hack.tags.length*2))
    expected = hack.num_prizes
    expected = 0 if hack.num_prizes == undefined
    if expected == Math.round(rate(hack.num_likes, hack.num_comments,hack.tags.length*2))
        correct += 1

console.log "Correctness = " + correct/data.length

    

