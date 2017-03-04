import tensorflow as tf
import json
import random
DATA_FILE="output/devpostdump.json"
data = json.loads(open(DATA_FILE, "r").read())
NUM_THREADS = 64

inLikes = [x["num_likes"]*2 for x in data]
inComments = [x["num_comments"]*2 for x in data]
inTags = [len(x["tags"])*2 for x in data]

inExpected = [x["num_prizes"]*2 if 'num_prizes' in x else 0 for x in data]

print(len(inLikes))
print(len(inComments))
print(len(inTags))

bestSet = []
bestRes = 0

output = open("training_results.log", "w+")

for l in range(100):
    print("loop" + str(l))
    #optimizer values
    mutability_rate = 0.000001
    iterations = 10000
    

    # main scope
    with tf.name_scope('main') as scope:
        likes    = tf.placeholder(tf.float32, name ="Likes")
        comments = tf.placeholder(tf.float32, name ="Comments")
        tags     = tf.placeholder(tf.float32, name ="TagSize")
        z = tf.Variable([1.],tf.float32,name="master_multiplier")
        x = tf.Variable([1.],tf.float32,name="bias")
        a = tf.Variable([random.random()],tf.float32,name="like_multipler")
        b = tf.Variable([random.random()],tf.float32,name="comment_multipler")
        c = tf.Variable([random.random()],tf.float32,name="tags_multiplier")
        expected = tf.placeholder(tf.float32, name ="Expected_likes")

    # Functions for the model and trainning
    linear_model = z*(x*((a * likes) + (b * comments)) + (c*c * tags))
    squared_deltas = tf.square(linear_model-expected)
    loss = tf.reduce_sum(squared_deltas)

    optimizer = tf.train.GradientDescentOptimizer(mutability_rate)
    train = optimizer.minimize(loss)


    sesh = tf.Session(config=tf.ConfigProto(intra_op_parallelism_threads=NUM_THREADS))
    with sesh.as_default():
        tf.global_variables_initializer().run()

    #Start training

    for i in range(iterations):
        sesh.run(train, {likes:inLikes,comments:inComments,tags:inTags,expected:inExpected})
        # print(sesh.run([z,x,a,b,c]))
        diff = 0
        # for j in range(100):
        #     diff +=abs(inLikes[j]*sesh.run([a][0][0])+inComments[j]*sesh.run([b][0][0]) - inExpected[j]+inTags[j]*sesh.run([c][0][0]))
        # diff = diff/100
        # print(diff)


    #After trainning
    print("Trainning results")
    z = sesh.run([z][0][0])
    x = sesh.run([x][0][0])
    a = sesh.run([a][0][0])
    b = sesh.run([b][0][0])
    c = sesh.run([c][0][0])


    print("Set: [z,x,a,b,c] = [%f,%f,%f,%f,%f]"%(z,x,a,b,c))
    print("Testing Correctness...")

    correct = 0
    for i in range(len(data)):
        likes = inLikes[i]
        comments = inComments[i]
        tags = inTags[i]
        prediction = (z*(x*((a * likes) + (b * comments)) + (c*c * tags)))
        expected = inExpected[i]

        # print((data[i]["name"]).encode('utf-8'))
        print("Prediction " + str(prediction))
        # print("Lets go boyz")
        print("%f*(%f*((%f * %f) + (%f * %f)) + (%f*%f * %f))"%(z,x,a,likes,b,comments,c,c,tags))
        # print(str(z,x,a,b,c)

        if round(prediction) == expected:
            correct += 1

    c = correct/float(len(data))
    print("Correctness = %f" %(c))

    if c > bestRes:
        bestRes = c
        bestSet = [z,x,a,b,c]
        print("New best set " + str(bestSet))
        output.write("Correctness " + str(c) + "\n")
        output.write("New best set " + str(bestSet) + "\n")

output.close() 
