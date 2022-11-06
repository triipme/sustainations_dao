// primitives
use geo::Centroid;
use geo::ConvexHull;
use geo::{line_string, polygon};
use geomorph::*;
use ran::{set_seeds, Rnum};
use ic_cdk::api::time;
// use utm::wsg84_utm_to_lat_lon;
// use utm::Utm;
// use std::path::Path;
// use gdal::Dataset;
// use gdal::vector::LayerAccess;
// use proj::Proj;

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
fn randomnumber(begin : f64, end: f64) -> u64 {
    let start = time();
    set_seeds(start as u64);
    let ru = Rnum::newu64();
    let number = ru.rannum_in(begin, end).getu64();
    ic_cdk::print(format!("{:?}", number));
    return number.unwrap();
}


#[ic_cdk_macros::query]
fn randomtwonumber(begin : f64, end: f64) -> (u64, u64) {
    let startI = time();
    set_seeds(startI as u64);
    let ruI = Rnum::newu64();
    let numberI = ruI.rannum_in(begin, end).getu64();

    let mut startJ = time();
    if (startI == startJ) {startJ = time()+1;}
    set_seeds(startJ as u64);
    let ruJ = Rnum::newu64();
    let numberJ = ruJ.rannum_in(begin, end).getu64();
    ic_cdk::print(format!("{:?} {:?}", startI, startJ));
    return (numberI.unwrap(), numberJ.unwrap());
}

#[ic_cdk_macros::query]
fn randompair(begin : f64, end: f64) -> (u64,u64) {
    let start = time();
    let ru = Rnum::newu64();
    
    set_seeds(start as u64);
    let num1 = ru.rannum_in(begin, end).getu64();

    set_seeds(start*2 as u64);
    let num2 = ru.rannum_in(begin, end).getu64();

    return (num1.unwrap(),num2.unwrap());
}


#[ic_cdk_macros::query]
fn proj(easting: f64, northing: f64, zone_num: i32, zone_letter: String) -> (f64, f64) {
    let utm_t = utm::Utm::new(easting, northing, true, zone_num, zone_letter.chars().nth(0).unwrap(), false);
    let latlon: coord::Coord = utm_t.clone().into();
    ic_cdk::print(format!("{:?} {:?}", latlon.lat, latlon.lon));
    return (latlon.lon, latlon.lat);
}

