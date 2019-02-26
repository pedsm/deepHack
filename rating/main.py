def rate(Likes, Comments, Tags):
    a = 0.0143
    b = 0.0413
    c = 0.0367
    return Likes * a + Comments * b + Tags * c 
