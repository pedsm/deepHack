fs   = require 'fs'
data = require './output/devpostdump.json' 
# data = require './devpostdump.json'

console.log "Project count =" + data.length

# values = [0.266894, 0.60971, 0.086982, 0.276643, 0.370835]
values = [0.710852,0.918123,0.022008,0.063375,0.227326]

rate = (likes,comments,tags) ->
    # values = [-0.17166938, 0.17166938, -1.0890068, 0.40597844, 0.8478532721967487]
    z = values[0]
    x = values[1]
    a = values[2]
    b = values[3]
    c = values[4]
    return z*(x*((a * likes) + (b * comments)) + (c*c * tags))


correct = 0
for hack in data
    likes = hack.num_likes * 2
    comments = hack.num_comments * 2
    tags = hack.tags.length * 2
    # console.log hack.name
    # console.log "Predicted " + (rate(likes, comments,tags))
    expected = hack.num_prizes
    expected = 0 if hack.num_prizes == undefined
    # console.log "Expected " + expected*2
    # console.log "Lets go boyz"
    # z = values[0]
    # x = values[1]
    # a = values[2]
    # b = values[3]
    # c = values[4]
    # console.log "#{z}*(#{x}*((#{a} * #{likes}) + (#{b} * #{comments})) + (#{c}*#{c} * #{tags}))"
    # console.log values[0]
    # console.log values[1]
    # console.log values[2]
    # console.log values[3]
    # console.log values[4]
    if expected  == Math.round(rate(hack.num_likes, hack.num_comments,hack.tags.length*2))
        correct += 1

console.log "Correctness = " + correct/data.length

    

