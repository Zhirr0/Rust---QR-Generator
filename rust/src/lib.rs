use wasm_bindgen::prelude::*;
use qrcode::{EcLevel, QrCode};
use qrcode::render::svg;

#[wasm_bindgen]
pub fn generate_qr(text: &str, error_level: &str, size: u32) -> String {
    let ec = match error_level {
        "L" => EcLevel::L,
        "Q" => EcLevel::Q,
        "H" => EcLevel::H,
        _   => EcLevel::M,
    };

    let code = match QrCode::with_error_correction_level(text.as_bytes(), ec) {
        Ok(c)  => c,
        Err(_) => return String::from("<svg xmlns='http://www.w3.org/2000/svg'></svg>"),
    };

    code.render::<svg::Color>()
        .min_dimensions(size, size)
        .max_dimensions(size, size)
        .dark_color(svg::Color("#F5F5F0"))
        .light_color(svg::Color("transparent"))
        .build()
}