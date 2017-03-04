const values = [0.710852, 0.918123, 0.022008, 0.063375, 0.227326];
function rate(iLikes,iComments,iTags)
{
    likes = iLikes*2
    comments = iComments*2
    tags = iTags*2

    z = values[0];
    x = values[1];
    a = values[2];
    b = values[3];
    c = values[4];

    return z * (x * ((a * likes) + (b * comments)) + (c * c * tags));
}


module.exports = {rate}
