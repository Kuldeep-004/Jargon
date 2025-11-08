import rateLimit from 'express-rate-limit'

export const authLimiter=rateLimit({
    windowMs:10*60*1000,
    max:10,
    message:{error:"Too many requests"},
})