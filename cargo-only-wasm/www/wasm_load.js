function make_environment(...envs) {
    return new Proxy(envs, {
        get(target, prop, receiver) {
            for (let env of envs) {
                if (env.hasOwnProperty(prop)) {
                    return env[prop];
                }
            }
            return (...args) => {
                throw new Error(`NOT IMPLEMENTED: ${prop} ${args}`);
            }
        }
    });
}

let previous = undefined;
let wasm = undefined;
let ctx = undefined;
let dt = undefined;
let targetFPS = 60;
let entryFunction = undefined;

function cstrlen(mem, ptr) {
    let len = 0;
    while (mem[ptr] != 0) {
        len++;
        ptr++;
    }
    return len;
}

function cstr_by_ptr_len(mem_buffer, ptr, len){
    const bytes = new Uint32Array(mem_buffer, ptr, len);
    let new_arr = []
    bytes.forEach(function(x){
        new_arr.push(String.fromCharCode(x));
    });
    return new_arr.join("");
}

function cstr_by_ptr(mem_buffer, ptr) {
    const mem = new Uint8Array(mem_buffer);
    const len = cstrlen(mem, ptr);
    const bytes = new Uint8Array(mem_buffer, ptr, len);
    return new TextDecoder().decode(bytes);
}

await WebAssembly.instantiateStreaming(fetch('../target/wasm32-unknown-unknown/debug/no_bindgen_wasm.wasm'), {
    env: make_environment({
        log_console: (str_ptr) => {
            let buf = wasm.instance.exports.memory.buffer;
            console.log(cstr_by_ptr(buf,str_ptr));
        },
        Rust_to_Js: (x,y) => {
            let new_img = document.createElement("img");
            new_img.src = "./Smiley.svg.png"
            new_img.width = 25;
            new_img.style.position = 'absolute';
            new_img.style.left = `${x-12}px`;
            new_img.style.top = `${y-12}px`;
            document.body.appendChild(new_img);
        }
    })
})
.then((w) => {
    wasm = w;
    console.log(wasm);
    let funcs = wasm.instance.exports;
    console.log("Using the rust wasm module we add 1 and 2 to get",funcs.add(1,2));
    //If exceding 32 bits you must use big_ints
    console.log("Using the rust wasm module we add 1 and 2 to get",funcs.big_add(BigInt(1),BigInt(2)));
    //I cant find the reason we need to pass 0 as the first arg, possible an implicit self since this is a function of DataHolder?
    let new_DataHolder = funcs.DataHolder_new(0,10,20); 
    console.log("Adding the data in Data Holder is:",funcs.DataHolder_add(new_DataHolder));
})
.catch((err) => console.log(err));

document.onclick = (click) => {
    wasm.instance.exports.Javascript_to_Rust(click.x,click.y);
};
