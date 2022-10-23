// primitives
use geo::Centroid;
use geo::ConvexHull;
use geo::{line_string, polygon};

use utm::wsg84_utm_to_lat_lon;
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

#[ic_cdk_macros::query]
fn proj() -> () {
    // let from = "EPSG:2230";
    // let to = "EPSG:26946";
    // let ft_to_m = Proj::new_known_crs(&from, &to, None).unwrap();
    // let result = ft_to_m
    //   .convert((4760096.421921f64, 3744293.729449f64))
    //   .unwrap();

    let easting = 261878_f64;
    let northing = 6243186_f64;
    let zone_num = 20_u8;
    let zone_letter = 'N';
    let (lat, long) = wsg84_utm_to_lat_lon(easting, northing, zone_num, zone_letter).unwrap();
    ic_cdk::print(format!("{:?} {:?}", lat, long));
}
