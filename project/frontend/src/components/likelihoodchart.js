import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LikelihoodChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Group data by topic and calculate average likelihood
    const topicData = d3.rollups(
      data.filter(d => d.topic && d.topic !== '' && d.likelihood),
      v => d3.mean(v, d => d.likelihood),
      d => d.topic
    )
      .map(([topic, avgLikelihood]) => ({ topic, avgLikelihood }))
      .sort((a, b) => b.avgLikelihood - a.avgLikelihood)
      .slice(0, 10);

    // Set dimensions
    const margin = { top: 30, right: 30, bottom: 100, left: 60 };
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
    const xScale = d3.scaleBand()
      .domain(topicData.map(d => d.topic))
      .range([0, width])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(topicData, d => d.avgLikelihood) * 1.1])
      .range([height, 0]);

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

    // Add y-axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -50)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .text('Average Likelihood');

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

    // Create bars
    svg.selectAll('rect')
      .data(topicData)
      .join('rect')
      .attr('x', d => xScale(d.topic))
      .attr('y', d => yScale(d.avgLikelihood))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - yScale(d.avgLikelihood))
      .attr('fill', '#6A5ACD')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('fill', '#483D8B');
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(`Topic: ${d.topic}<br/>Avg. Likelihood: ${d.avgLikelihood.toFixed(2)}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('fill', '#6A5ACD');
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

export default LikelihoodChart;