import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TopicChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Group data by topic and count occurrences
    const topicCounts = d3.rollups(
      data.filter(d => d.topic && d.topic !== ''),
      v => v.length,
      d => d.topic
    )
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Set dimensions
    const width = 500;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    // Clear previous SVG
    d3.select(svgRef.current).selectAll('*').remove();

    // Create SVG
    const svg = d3.select(svgRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Create color scale
    const color = d3.scaleOrdinal()
      .domain(topicCounts.map(d => d.topic))
      .range(d3.schemeCategory10);

    // Create pie generator
    const pie = d3.pie()
      .value(d => d.count)
      .sort(null);

    // Create arc generator
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius * 0.8);

    // Create outer arc for labels
    const outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    // Create tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'rgba(0, 0, 0, 0.7)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('pointer-events', 'none');

    // Add pie chart
    const slices = svg.selectAll('path')
      .data(pie(topicCounts))
      .join('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.topic))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.7)
      .on('mouseover', function(event, d) {
        d3.select(this).style('opacity', 1);
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(`Topic: ${d.data.topic}<br/>Count: ${d.data.count} (${(d.data.count / data.filter(d => d.topic && d.topic !== '').length * 100).toFixed(1)}%)`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).style('opacity', 0.7);
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    // Add text labels
    const labels = svg.selectAll('text')
      .data(pie(topicCounts))
      .join('text')
      .attr('transform', d => {
        const pos = outerArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.99 * (midAngle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style('text-anchor', d => {
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midAngle < Math.PI ? 'start' : 'end';
      })
      .style('font-size', '12px')
      .text(d => d.data.topic);

    // Add lines connecting slices to labels
    svg.selectAll('polyline')
      .data(pie(topicCounts))
      .join('polyline')
      .attr('points', d => {
        const pos = outerArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
        return [arc.centroid(d), outerArc.centroid(d), pos];
      })
      .style('fill', 'none')
      .style('stroke', '#aaa')
      .style('stroke-width', '1px');

    // Clean up
    return () => {
      d3.select('body').selectAll('.tooltip').remove();
    };
  }, [data]);

  return <div ref={svgRef} className="chart-container"></div>;
};

export default TopicChart;