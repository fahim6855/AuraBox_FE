const authMiddleware = async (c, next) =>{
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")){
        return c.json({error: "unauthorized"}, 401) 
    }
    const token = authHeader.split(" ")[1];
    
    try{
        const payload = await verify(token, jwtSecret, "HS256");
        c.set("user", payload);
        await next();
    }
    catch(err){
        return c.json({error: "invalid token"},401)
    }
}

//add route
app.post("/add", authMiddleware, async (c) =>{
    try{
        const body =  await c.req.json();
        const user = c.get("user");
        const user_id = user.sub;
        const title = body.title;
        const content = body.content;

        await db.execute({
            sql: "INSERT INTO notes (title, content, user_id) VALUES (?, ?, ?)",
            args: [title, content, user_id]
        });
        return c.json({success: true}, 200);
    }
    catch(err){
        return c.json({error: err.message}, 500)
    }
})