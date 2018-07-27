import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BuildGraphService } from '../services/build-graph.service';
import { APIService} from '../services/api-service/api.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import * as d3 from 'd3';

interface Node {
  id: number;
  group: number;
}

interface Link {
  source: number;
  target: number;
  value: number;
}

interface Graph {
  nodes: Node[];
  links: Link[];
}

@Component({
	selector: 'front-page',
	templateUrl: './front-page.component.html',
	styleUrls: ['./front-page.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class FrontPageComponent implements OnInit{ 
    nodes: string[] = [];
	visited: string[] = [];
	toBeVisited: string[] = [];
	
	constructor(public apiService: APIService, public router: Router, private buildGraphService: BuildGraphService) {}
	
	ngOnInit() {
		alert('in front page');
		this.buildGraphService.buildGraph();
		
		
	console.log('D3.js version:', d3['version']);
    // D3.js graph function 
	// here the returned values from the buildGraph function which contains the link values needs to be passed to the  links variable in line 70 
    const svg = d3.select('svg');
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-4000))
      .force('center', d3.forceCenter(width / 2, height / 2));

      const nodes: Node[] = [
        {'id': 1, 'group': 1},
        {'id': 2, 'group': 1},
        {'id': 3, 'group': 1},
        {'id': 4, 'group': 1},
        {'id': 5, 'group': 1}
      ];
      const links: Link[] = [
        {'source': 2, 'target': 1, 'value': 1},
        {'source': 3, 'target': 1, 'value': 1},
        {'source': 4, 'target': 1, 'value': 1},
        {'source': 5, 'target': 1, 'value': 1},
        {'source': 1, 'target': 2, 'value': 1},
        {'source': 3, 'target': 2, 'value': 1},
        {'source': 4, 'target': 2, 'value': 1},
        {'source': 5, 'target': 2, 'value': 1},
        {'source': 2, "target": 3, "value": 1},
        {'source': 1, "target": 3, "value": 1},
        {'source': 4, "target": 3, "value": 1},
        {'source': 5, "target": 3, "value": 1},
        {'source': 2, "target": 4, "value": 1},
        {'source': 3, "target": 4, "value": 1},
        {'source': 1, "target": 4, "value": 1},
        {'source': 5, "target": 4, "value": 1},
        {'source': 2, "target": 5, "value": 1}, 
        {'source': 3, "target": 5, "value": 1},
        {'source': 4, "target": 5, "value": 1},
        {'source': 1, "target": 5, "value": 1}
      ];
	  
      const graph: Graph = <Graph>{ nodes, links };

      const link = svg.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(graph.links)
        .enter()
        .append('line')
        .attr('stroke-width', (d: any) => Math.sqrt(d.value));

      const node = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(graph.nodes)
        .enter()
        .append('circle')
        .attr('r', 30 )
        .attr('fill', (d: any) => color('1'));

      svg.selectAll('circle').on('click', clicked)
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      );

      node.append('title')
        .text((d) => d.id);

      simulation
        .nodes(graph.nodes)
        .on('tick', ticked);

      simulation.force<d3.ForceLink<any, any>>('link')
        .links(graph.links);
		
      function clicked() {
        window.open('http://10.223.155.54:4200/explorer');
      }
      function ticked() {
        link
          .attr('x1', function(d: any) { return d.source.x; })
          .attr('y1', function(d: any) { return d.source.y; })
          .attr('x2', function(d: any) { return d.target.x; })
          .attr('y2', function(d: any) { return d.target.y; });

        node
          .attr('cx', function(d: any) { return d.x; })
          .attr('cy', function(d: any) { return d.y; });
      }
    function dragstarted(d) {
      if (!d3.event.active) { simulation.alphaTarget(0.3).restart(); }
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) { simulation.alphaTarget(0); }
      d.fx = null;
      d.fy = null;
    }
  }	
}