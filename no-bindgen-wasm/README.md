# Build WASM modules with only vanilla Cargo
WASM is a first class target for rust which means that all you need to build is cargo. No external libraries, no other build tool, no npm, no node. This is a quick example of building wasm modules that provide simple and straightforward access to and from the browser and rust.

# Build Prerequisites
If you can compile rust you can build this project. If you cant compile rust get setup [here](https://www.rust-lang.org/learn/get-started). Once you are setup to build rust projects run 

`rustup target add wasm32-unknown-unknown`

to add the WASM compilation target

# Building
Run `cargo build`

The .cargo/config.toml file sets up for targeting WASM automatically but you can also do. 

`cargo build --target wasm32-unknown-unknown`
# Serving the website

Wasm modules can't be loaded without a server due to [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) so you need to serve the page somehow

If you have python installed navigate to the www folder and run

`python -m http.server 6969`

If using vscode I like to use the [live server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) plugin.

# Platforms
✅ Windows
✅ Linux
❔ Mac (Do not have one to test with)

# Contributing
Please feel free to contribute anything you find useful!!