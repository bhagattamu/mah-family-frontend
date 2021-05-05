import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
/** ol imports **/
import Map from 'ol/Map';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Geocoder from 'ol-geocoder';
import Overlay from 'ol/Overlay';
import { Modify } from 'ol/interaction';
import { Collection } from 'ol';
import * as proj from 'ol/proj';

@Component({
    selector: 'app-osm-map',
    templateUrl: './osm.component.html',
    styleUrls: ['./osm.component.scss']
})
export class OSMMapComponent implements OnInit, OnChanges {
    @Input() longitude: number;
    @Input() latitude: number;
    @Output() onChange = new EventEmitter();
    map: any;
    geocoder: any;
    geoMarker: any;
    vectorLayer: any;
    styles: any;
    constructor() {}

    ngOnInit(): void {
        this.initializeMap();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((location: any) => {
                this.longitude = location.coords.longitude;
                this.latitude = location.coords.latitude;
                this.changeMarker(location.coords.longitude, location.coords.latitude);
            });
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['longitude']?.currentValue || changes['latitude']?.currentValue) {
            if (Number(changes['longitude']?.currentValue)) {
                this.longitude = Number(changes['longitude']?.currentValue);
            }
            if (Number(changes['latitude']?.currentValue)) {
                this.latitude = Number(changes['latitude']?.currentValue);
            }
            if (this.longitude && this.latitude) {
                console.log();
                this.changeMarker(this.longitude, this.latitude);
            }
        }
    }

    initializeMap() {
        const container = document.getElementById('popup');
        const content = document.getElementById('popup-content');
        this.geocoder = new Geocoder('nominatim', {
            provider: 'osm',
            lang: 'en-US', //en-US, fr-FR
            placeholder: 'Search for ...',
            targetType: 'text-input',
            limit: 5,
            keepOpen: true
        });
        const openStreetMapStandard = new Tile({
            source: new OSM(),
            visible: true
        });
        this.map = new Map({
            target: 'map',
            layers: [openStreetMapStandard],
            view: new View({
                projection: 'EPSG:4326',
                center: [83.98965296495749, 28.185132688866673],
                zoom: 15
            })
        });
        this.styles = {
            geoMarker: new Style({
                image: new Icon({
                    color: 'red',
                    crossOrigin: 'anonymous',
                    src: 'assets/images/map/map-pin.svg',
                    anchor: [0.36, 0.6],
                    // opacity: 0.75,
                    imgSize: [80, 80]
                })
            })
        };

        const overlay = new Overlay({
            element: container,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        });

        this.map.addControl(this.geocoder);

        const geocoderSource = this.geocoder.getSource();
        this.geocoder.on('addresschosen', function (evt) {
            const address = evt.address;
            geocoderSource.clear();
            content.innerHTML = '<p>' + address.formatted + '</p>';
            overlay.setPosition(evt.coordinate);
        });

        this.map.on('singleclick', (event) => {
            this.longitude = event.coordinate[0];
            this.latitude = event.coordinate[1];
            this.onChange.emit({
                longitude: this.longitude,
                latitude: this.latitude,
                extra: ''
            });
            this.changeMarker(this.longitude, this.latitude);
        });
    }

    changeMarker(longitude: number, latitude: number): void {
        if (!this.geoMarker) {
            this.geoMarker = new Feature({
                type: 'geoMarker',
                geometry: new Point(fromLonLat([longitude, latitude]))
            });
            this.vectorLayer = new VectorLayer({
                source: new VectorSource({
                    features: [this.geoMarker]
                }),
                style: (feature: any) => {
                    return this.styles[feature.get('type')];
                }
            });
            const modify = new Modify({
                features: new Collection([this.geoMarker])
            });
            this.map.addLayer(this.vectorLayer);
            this.map.addInteraction(modify);
            this.geoMarker.on('change', this.onDragMarker, this.geoMarker);
        }
        this.geoMarker.changed();
        this.geoMarker.getGeometry().setCoordinates([longitude, latitude]);
    }

    onDragMarker = (event: any) => {
        this.longitude = event.target.getGeometry().getCoordinates()[0];
        this.latitude = event.target.getGeometry().getCoordinates()[1];
        this.onChange.emit({
            longitude: this.longitude,
            latitude: this.latitude,
            extra: ''
        });
    };
}
