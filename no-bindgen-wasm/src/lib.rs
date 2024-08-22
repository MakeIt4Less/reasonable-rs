#[no_mangle]
pub extern fn add(x:u32,y:u32) -> u32 {
    x + y
}

#[no_mangle]
pub extern fn big_add(x:u64,y:u64) -> u64 {
    x + y
}

extern {
    pub fn log_console(data:*const u8);
    pub fn Rust_to_Js(x:u16,y:u16);
}

fn log(data:&str){
    unsafe {
        log_console(data.as_ptr());
    }
}

fn rust_to_javascript(x:u16,y:u16){
    unsafe {
        Rust_to_Js(x,y);
    }
}

#[repr(C)]
pub struct DataHolder{
    a:u32,
    b:u32,
}

impl DataHolder{
    #[no_mangle]
    pub extern fn DataHolder_new(x:u32,y:u32) -> Self{
        log(&format!("Got x:{} and y:{}\0",x,y));
        DataHolder{a:x,b:y}
    }

    #[no_mangle]
    pub extern fn DataHolder_add(&mut self) -> u32{
        log(&format!("Adding {} and {}\0",self.a,self.b));
        self.a + self.b
    }
}

#[no_mangle]
pub extern fn Javascript_to_Rust(mouse_x:u16,mouse_y:u16) {
    log(&format!("Mouse clicked at {}, {}. Printed from rust\0",mouse_x,mouse_y));
    for i in -1..=1 {
        rust_to_javascript((mouse_x as i16 + 20 * i) as u16,mouse_y);
        rust_to_javascript(mouse_x,(mouse_y as i16 + 20 * i) as u16);
    }
    
}
