import * as _ from 'lodash';
import { environment } from '../../environments/environment';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import * as Q from 'q';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/defer';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/toPromise';
/**
 * Service to assist in building of a graph for the validator network.
 */
 
 @Injectable()
 export class BuildGraphService {
	nodes: any [] ;
	visited:string [];
	toBeVisited: string [];
	objectBlock:any;
	links: any [];
	val:any;
	mapDetails = [
		{name:'validator-0', address:'http://10.223.155.123:8008'},
		{name:'validator-1', address:'http://10.223.155.123:8009'},
		{name:'validator-2', address:'http://10.223.155.123:8010'},
		{name:'validator-3', address:'http://10.223.155.123:8011'}
		];
 
	// url used to reach the API
	apiURL: string;

	// milliseconds before service times out
	apiTimeout = 10000;
	/**
	 * @param http {Http} - service for making HTTP requests
	 */
	 
	constructor(public http: Http) {
		// set url from environment variables
		this.apiURL = environment.RestAPIUrl;
		this.toBeVisited = [];
		this.visited = [];
		this.nodes = [];
		this.val = "";
		this.links = [];
		// if API timeout specified, update
    if (environment.apiTimeout)this.apiTimeout = environment.apiTimeout;
	}

	getPeers(apiURL){
		return this.http.get(apiURL + '/peers')
			.timeout(this.apiTimeout)
			.map(response => response.json())
			.catch(err => Observable.throw(err));
	}
	
	getPeers1(URL:string){
		return this.http.get(URL+'/peers')
			.timeout(this.apiTimeout)
			.map(response => response.json())
			.catch(err => Observable.throw(err));
	}
	
	//function to check if the validator is visited and if not, return it's rest API address. 
	isVisited(name:string): string {
		if(this.visited.includes(name)){alert("yes"); return 'yes';}
		else
		{
			for(let i=0; i<this.mapDetails.length;i++){
				if(this.mapDetails[i].name == name)
				{
					return (this.mapDetails[i].address);
				}
			}
		}
	}  
	
	// this function tried to build a graph
	// here initially we make a call to the getPeers function which in turn makes a get request and obtains the peers of the initial nodeName
	// these peers obtained is stored in the toBeVisited[] and the ones already visited is pushed into Visited array[]
	// the link object is created in line 103 which will be pushed into the link[] to create an array of links;
	buildGraph() {
		let deferred = Q.defer();
		let obj = this;	
		this.getPeers(this.apiURL)
		.subscribe(
			data => {
				let initial = "validator-0";
				let init = 0;
				this.visited.push(initial);
				console.log(this.visited);
				let length = data.data.length;
				let i = 0;
				while( i < length){
					let name = data.data[i].split('/')[2].split(':')[0];
					this.toBeVisited.push(name);
					let val =parseInt(data.data[i].split('/')[2].split(':')[0].split('-')[1]);					
					i++;	
					let obje = {"source": init, "target": val, "value":1};
					this.links.push(obje);
				}
				setTimeout(function () {
					deferred.resolve();
					console.log('long-running operation inside loop done');
				}, 2000);
			}
	    ); 
	// In the below part of the function the above mentioned functionality is used recursively to loop through all the nodes
	// and in turn get their peers. This will result in a graph to be built.
		deferred.promise.then(function() {					
			while(obj.toBeVisited.length != 0) {
				let newName = obj.toBeVisited.shift();
				let result = obj.isVisited(newName);
				if(result == 'yes'){let k = 0; }
				else {
					obj.getPeers1(result)
					.subscribe(
						data => {
							obj.visited.push(newName);
							let init = parseInt(newName.split('-')[1]);
							let length = data.data.length;
							let j = 0;
							while( j < length){
								let name = data.data[j].split('/')[2].split(':')[0];
								obj.toBeVisited.push(name);
								let val = parseInt(data.data[j].split('/')[2].split(':')[0].split('-')[1]);
								let obje = {"source": init, "target": val, "value":1};
								obj.links.push(obje);
								j++;
							}
						});
					}
			}
			console.log("here are the links", obj.links);
			});			
		}
}
// To be done
// pass the Link[] values from the buildGraph function to frontPageComponent class.
// from line 128 till line 134 , make the code synchronous 
//