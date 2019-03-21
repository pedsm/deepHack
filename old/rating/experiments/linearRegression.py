import tensorflow as tf
#optimizer values
mutability_rate = 0.01
iterations = 10000

# model parts
with tf.name_scope('main') as scope:
    #values
    a = tf.Variable([3.],tf.float32, name="multiplier")
    b = tf.Variable([-3.],tf.float32, name="constant")
    x = tf.placeholder(tf.float32, name="input")
    y = tf.placeholder(tf.float32, name="expected")


#functions
linear_model = a * x + b 
squared_deltas = tf.square(linear_model-y)
loss = tf.reduce_sum(squared_deltas)


#define a trainning process, with an optimized
optimizer = tf.train.GradientDescentOptimizer(mutability_rate)
train = optimizer.minimize(loss)

init = tf.global_variables_initializer()

# Summary stuff
tf.summary.scalar("loss",loss)
tf.summary.scalar("accuracy", squared_deltas)

mergedSummary = tf.summary.merge_all()

sesh = tf.Session()
sesh.run(init)
writter = tf.summary.FileWriter("logs",sesh.graph)

for i in range(iterations):
    summary = sesh.run(train, {x:[1,2,3,4,5], y:[11,21,31,41,51]})
    print("Current iteration %d" %(i))

#writer -- for tensorboard
print(sesh.run([a,b]))
# print(sesh.run(adder_node, {a: [1,3], b: [2, 4]}))
