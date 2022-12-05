// primitives
use geo::Centroid;
use geo::ConvexHull;
use geo::{line_string, polygon};
use geomorph::*;
use ic_cdk::api::time;
use ran::{set_seeds, Rnum};
// use serde_json::json;
// use utm::wsg84_utm_to_lat_lon;
// use utm::Utm;
// use std::path::Path;
// use gdal::Dataset;
// use gdal::vector::LayerAccess;
// use proj::Proj;
// use ic_cdk::api::management_canister::http_request::{
//     http_request, CanisterHttpRequestArgument, HttpHeader, HttpMethod, HttpResponse, TransformArgs,
//     TransformContext,
// };
// use ic_cdk_macros::{self, query, update};
// use serde_json::{self, from_str, Value};

#[ic_cdk_macros::query]
fn greet() -> () {
    let line_string = line_string![
      (x: 40.02f64, y: 113.34),
      (x: 40.02f64, y: 114.23),
      (x: 30.02f64, y: 115.23),
      (x: 30.02f64, y: 116.23),
      (x: 40.02f64, y: 117.23),
    ];
    // An L shape
    let poly = polygon![
        (x: 0.0, y: 0.0),
        (x: 4.0, y: 0.0),
        (x: 4.0, y: 1.0),
        (x: 1.0, y: 1.0),
        (x: 1.0, y: 4.0),
        (x: 0.0, y: 4.0),
        (x: 0.0, y: 0.0),
    ];
    let hull = poly.convex_hull();

    // println!("{}", format!("{:?}", line_string.centroid()))
    ic_cdk::print(format!("{:?}", hull.exterior()));
    ic_cdk::print(format!("Line Centroid{:?}", line_string.centroid()));
    ic_cdk::print(format!("Poly Centroid: {:?}", poly.centroid()));
}
// #[ic_cdk_macros::query]
// fn randomnumber(start : i32, end : i32) -> i32 {
//     let num: i32 = random!(start..=end);
//     ic_cdk::print(format!("{:?}", num));
//     return num;
// }
#[ic_cdk_macros::query]
fn randomnumber(begin: f64, end: f64) -> u64 {
    let start = time();
    set_seeds(start as u64);
    let ru = Rnum::newu64();
    let number = ru.rannum_in(begin, end).getu64();
    ic_cdk::print(format!("{:?}", number));
    return number.unwrap();
}

#[ic_cdk_macros::query]
fn randompair(begin: f64, end: f64) -> (u64, u64) {
    let start = time();
    let ru = Rnum::newu64();

    set_seeds(start as u64);
    let num1 = ru.rannum_in(begin, end).getu64();

    set_seeds(start * 2 as u64);
    let num2 = ru.rannum_in(begin, end).getu64();

    return (num1.unwrap(), num2.unwrap());
}

#[ic_cdk_macros::query]
fn proj(easting: f64, northing: f64, zone_num: i32, zone_letter: String) -> (f64, f64) {
    let utm_t = utm::Utm::new(
        easting,
        northing,
        true,
        zone_num,
        zone_letter.chars().nth(0).unwrap(),
        false,
    );
    let latlon: coord::Coord = utm_t.clone().into();
    ic_cdk::print(format!("{:?} {:?}", latlon.lat, latlon.lon));
    return (latlon.lon, latlon.lat);
}

// #[query]
// fn transform(raw: TransformArgs) -> HttpResponse {
//     let mut sanitized = raw.response.clone();
//     sanitized.headers = vec![
//         HttpHeader {
//             name: "Content-Security-Policy".to_string(),
//             value: "default-src 'self'".to_string(),
//         },
//         HttpHeader {
//             name: "Referrer-Policy".to_string(),
//             value: "strict-origin".to_string(),
//         },
//         HttpHeader {
//             name: "Permissions-Policy".to_string(),
//             value: "geolocation=(self)".to_string(),
//         },
//         HttpHeader {
//             name: "Strict-Transport-Security".to_string(),
//             value: "max-age=63072000".to_string(),
//         },
//         HttpHeader {
//             name: "X-Frame-Options".to_string(),
//             value: "DENY".to_string(),
//         },
//         HttpHeader {
//             name: "X-Content-Type-Options".to_string(),
//             value: "nosniff".to_string(),
//         },
//     ];
//     sanitized
// }

// #[update]
// async fn fetch_coin_price(id: String) -> f64 {
//     let request_headers = vec![];
//     let url = format!("https://api.coingecko.com/api/v3/simple/price?ids={id}&vs_currencies=usd");
//     ic_cdk::api::print(url.clone());

//     let request = CanisterHttpRequestArgument {
//         url: url,
//         method: HttpMethod::GET,
//         body: None,
//         max_response_bytes: None,
//         transform: Some(TransformContext::new(transform, vec![])),
//         headers: request_headers,
//     };
//     match http_request(request).await {
//         Ok((response,)) => {
//             // put the result to hashmap
//             let decoded_body = String::from_utf8(response.body)
//                 .expect("Remote service response is not UTF-8 encoded.");
//             let rs: Value = from_str(&decoded_body).unwrap();
//             let value = json!(rs)[id]["usd"].as_f64().expect("Error");
//             ic_cdk::print(format!("{:?}", value));
//             return value;
//           }
//           Err((r, m)) => {
//             let message =
//             format!("The http_request resulted into error. RejectionCode: {r:?}, Error: {m}");
//             ic_cdk::print(format!("{:?}", message));
//             return 0_f64;
//         }
//     }
// }
