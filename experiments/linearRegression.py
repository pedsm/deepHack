import tensorflow as tf
#optimizer values
mutability_rate = 0.01
iterations = 10000

# model parts
a = tf.Variable([3.],tf.float32)
b = tf.Variable([-3.],tf.float32)
x = tf.placeholder(tf.float32)

linear_model = a * x + b 

# Desired result
y = tf.placeholder(tf.float32)
# emphasize the error with a square function
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

for i in range(iterations):
    summary = sesh.run(train, {x:[1,2,3,4,5], y:[11,21,31,41,51]})
    print("Current iteration %d" %(i))

#writer -- for tensorboard
writter = tf.summary.FileWriter("logs", graph=tf.get_default_graph())
print(sesh.run([a,b]))
# print(sesh.run(adder_node, {a: [1,3], b: [2, 4]}))
