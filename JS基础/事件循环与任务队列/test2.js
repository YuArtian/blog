console.log('stack [1]');
setTimeout(() => console.log("macro [2]"), 0);
setTimeout(() => console.log("macro [3]"), 1);

const p = Promise.resolve();
for(let i = 0; i < 3; i++) p.then(() => {
    setTimeout(() => {
        console.log('stack [4]')
        setTimeout(() => console.log("macro [5]"), 0);
        p.then(() => console.log('micro [6]'));
    }, 0);
    console.log("stack [7]");
});

console.log("macro [8]");