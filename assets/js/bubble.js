const margin = {
        top: 20,
        right: 38,
        bottom: 20,
        left: 70
    },

    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;


const svg = d3.select('#bubble')
    .append('div')
    .classed('svg-contatiner', true)
    .append('svg')
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', `0 0 600, 400`)
    .attr('id', 'svg-content-responsive')

const bubbleChart = d3.select('#svg-content-responsive')

const x = d3.scaleLinear()

const y = d3.scaleBand().rangeRound([0, height], 0.1)


Promise.all([
    d3.json('/src/data/final.json'),
    d3.json('/src/data/formattedFinal.json')

]).then(function (files) {

    const final = files[1];

    x.domain([d3.min(final, function (d) {
            return d.date
        }), d3.max(final, function (d) {
            return d.date
        })])
        .range([0, width])
        .nice();



    const nestedCulture = d3.nest()
        .key(function (d) {
            return d.culture;
        })
        .entries(final);
    console.log(nestedCulture)
    y.domain(nestedCulture.map(function (d) {
            return d.key
        }))
        .range([height, 0])


    const xAxis = d3.axisBottom(x)
        .tickSize(0)

    const yAxis = d3.axisLeft(y)
        .tickSize(0)
        .tickPadding(20);


    bubbleChart.append('g')
        .attr('class', 'xAxis')
        .attr('transform', `translate(${margin.left}, ${height + margin.top})`)
        .call(xAxis)
    bubbleChart.append('g')
        .attr('class', 'yAxis')
        .call(yAxis)
        .attr('transform', `translate(${margin.left},${margin.top})`)


    bubbleChart.append('g')
        .selectAll('dot')
        .data(final)
        .enter()
        .append('circle')
        .attr('cx', function (d, i) {
            return x(d.date)
        })
        .attr('cy', function (d) {
            return y(d.culture)
        })
        .attr('r', 7)
        .style('fill', function (d) {
            return d3.rgb(d.colorValue[0], d.colorValue[1], d.colorValue[2])
        })
        .attr("stroke", "white")
        .style("stroke-width", ".5px")
        .attr('transform', `translate(${margin.left},${margin.top + 35})`)

    d3.selectAll('.domain').remove();

    d3.selectAll('button.btn')
        .on('click', function (d) {
            let selectedOption = d3.select(this).property('value')
            console.log(selectedOption);
            updateChart(selectedOption);
        })

    function updateChart(selected) {
        d3.selectAll('text').remove();
        d3.selectAll('circle').remove();
        const nested = d3.nest()
            .key(function (d) {
                console.log(d[selected])
                return d[selected];
            })
            .entries(final);


        x.domain([d3.min(final, function (d) {
                return d.date
            }), d3.max(final, function (d) {
                return d.date
            })])
            .range([0, width])
            .nice();
        y.domain(nested.map(function (d) {
            console.log(d.key);
            return d.key
        }))


        bubbleChart.append('g')
            .attr('class', 'xAxis')
            .attr('transform', `translate(${margin.left}, ${height + margin.top})`)
            .call(xAxis)
        bubbleChart.append('g')
            .attr('class', 'yAxis')
            .call(yAxis)
            .attr('transform', `translate(${margin.left},${margin.top})`)

            bubbleChart.append('g')
            .selectAll('dot')
            .data(final)
            .enter()
            .append('circle')
            .attr('cx', function (d, i) {
                return x(d.date)
            })
            .attr('cy', function (d) {
                return y(d[selected])
            })
            .attr('r', 7)
            .style('fill', function (d) {
                return d3.rgb(d.colorValue[0], d.colorValue[1], d.colorValue[2])
            })
            .attr("stroke", "white")
            .style("stroke-width", ".5px")
            .attr('transform', `translate(${margin.left},${margin.top + 35})`)
    
        d3.selectAll('.domain').remove();
    }

    bubbleChart.append('text')
        .text('A.D.')
        .attr('transform', `translate(${width + margin.left + 18}, ${height + margin.top + 10})`)
}).catch(function (err) {
    // handle error here
})