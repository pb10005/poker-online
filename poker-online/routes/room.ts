import express = require('express');
const router = express.Router();

router.get('/:id', (req: express.Request, res: express.Response)=>{
    res.render("room", { room: req.params.id});
});

export default router;