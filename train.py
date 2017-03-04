import tensorflow as tf
import json
DATA_FILE="output/devpostdump.json"
data = json.loads(open(DATA_FILE, "r").read())

inLikes = [x["num_likes"] for x in data]
inComments = [x["num_comments"] for x in data]

inExpected = [x["num_prizes"] if 'num_prizes' in x else 0 for x in data]
print(len(inLikes))
print(len(inLikes))


#optimizer values
mutability_rate = 0.00001 
iterations = 100000

# main scope
with tf.name_scope('main') as scope:
    likes = tf.placeholder(tf.float32, name ="Likes")
    comments = tf.placeholder(tf.float32, name ="Comments")
    a = tf.Variable([0.1],tf.float32,name="like_multipler")
    b = tf.Variable([0.1],tf.float32,name="comment_multipler")
    expected = tf.placeholder(tf.float32, name ="Expected_likes")

# Functions for the model and trainning
linear_model = a * likes + b * comments
squared_deltas = tf.square(linear_model-expected)
loss = tf.reduce_sum(squared_deltas)

optimizer = tf.train.GradientDescentOptimizer(mutability_rate)
train = optimizer.minimize(loss)


sesh = tf.Session()
with sesh.as_default():
    tf.global_variables_initializer().run()

#Start training

for i in range(iterations):
    sesh.run(train, {likes:inLikes,comments:inComments,expected:inExpected})
    # print("Current iteration %d" %(i))
    diff = 0
    if(i%100 == 0):
        for j in range(100):
            diff +=abs(inLikes[j]*sesh.run([a][0][0])+inComments[j]*sesh.run([b][0][0]) - inExpected[j])
        diff = diff/100
        print(diff)
        print(sesh.run([a,b]))


#After trainning
print("Trainning results")
print(sesh.run([a]))

