import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const RelevanceChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Filter data to include only records with start_year
    // If a particular record has no start_year but has end_year, use end_year
    const validData = data.filter(d => (d.start_year && d.start_year !== '') || (d.end_year && d.end_year !== ''))
      .map(d => ({
        ...d,
        year: d.start_year && d.start_year !== '' ? d.start_year : d.end_year
      }));

    if (validData.length === 0) return;

    // Group data by year and calculate average relevance
    const yearData = d3.rollups(
      validData,
      v => d3.mean(v, d => d.relevance),
      d => d.year
    )
      .map(([year, avgRelevance]) => ({ year, avgRelevance }))
      .sort((a, b) => a.year - b.year);

    // Set dimensions
    const margin = { top: 30, right: 30, bottom: 60, left: 60 };
    const width = 500 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear previous SVG
    d3.select(svgRef.current).selectAll('*').remove();

    // Create SVG
    const svg = d3.select(svgRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3.scalePoint()
      .domain(yearData.map(d => d.year))
      .range([0, width])
      .padding(0.5);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(yearData, d => d.avgRelevance) * 1.1])
      .range([height, 0]);

    // Create line generator
    const line = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.avgRelevance))
      .curve(d3.curveMonotoneX);

    // Create and add x-axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    // Create and add y-axis
    svg.append('g')
      .call(d3.axisLeft(yScale));

    // Add x-axis label
    svg.append('text')
      .attr('transform', `translate(${width / 2},${height + 50})`)
      .style('text-anchor', 'middle')
      .text('Year');

    // Add y-axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -50)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .text('Average Relevance');

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

    // Add the path
    svg.append('path')
      .datum(yearData)
      .attr('fill', 'none')
      .attr('stroke', '#FF7F50')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Add circles for each data point
    svg.selectAll('circle')
      .data(yearData)
      .join('circle')
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(d.avgRelevance))
      .attr('r', 6)
      .attr('fill', '#FF7F50')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('r', 8).attr('fill', '#FF6347');
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(`Year: ${d.year}<br/>Avg. Relevance: ${d.avgRelevance.toFixed(2)}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 6).attr('fill', '#FF7F50');
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    // Clean up
    return () => {
      d3.select('body').selectAll('.tooltip').remove();
    };
  }, [data]);

  return <div ref={svgRef} className="chart-container"></div>;
};

export default RelevanceChart;