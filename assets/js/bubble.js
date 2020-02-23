const margin = {
        top: 20,
        right: 38,
        bottom: 20,
        left: 70
    },

    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;


const svg = d3.select("#bubble")
    .append("div")
    .classed("svg-contatiner", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 600, 400`)
    .attr("id", "svg-content-responsive")


const bubbleChart = d3.select("#svg-content-responsive")

const x = d3.scaleLinear()

const y = d3.scaleBand().rangeRound([0, height], 0.1)


d3.json('https://raw.githubusercontent.com/yiranni/color-in-landscapes/gh-pages/src/data/formattedFinal.json', function (error, data) {

    const final = data;

    const defs = svg.append("defs");

    // x.domain([d3.min(final, function (d) {
    //         return d.date
    //     }), d3.max(final, function (d) {
    //         return d.date
    //     })])
    //     .range([0, width])
    //     .nice();

    x.domain(d3.extent(final, function (d) {
            return d.date
        }))
        .range([0, width])
        .nice()

    y.domain(final.map(function (d) {
            return d.culture
        }))
        .range([height, 0])



    var simulation = d3.forceSimulation(final)
        .force("x", d3.forceX(function (d) {
            console.log(x(d.date))
            return x(d.date);
        }).strength(10))
        .force("y", d3.forceY(function (d) {
            return y(d.culture - 35)
        }))
        .force("collide", d3.forceCollide(15))
        .stop();

    for (var i = 0; i < final.length; ++i) simulation.tick();

    const xAxis = d3.axisBottom(x)
        .tickSize(0)

    const yAxis = d3.axisLeft(y)
        .tickSize(0)
        .tickPadding(20);



    svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", `translate(${margin.left}, ${height + margin.top})`)
        .call(xAxis)
    svg.append("g")
        .attr("class", "yAxis")
        .call(yAxis)
        .attr("transform", `translate(${margin.left},${margin.top})`)

    defs.selectAll(".painting-pattern")
        .data(final)
        .enter().append("pattern")
        .attr("class", "painting-pattern")
        .attr("id", function (d) {
            return d.objectID
        })
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("patternContentUnits", "objectBoundingBox")
        .append("image")
        .attr("height", 1)
        .attr("width", 1)
        .attr("preserveAspectRatio", "none")
        .attr("xmlns:xlinks", "http://www.w3.org/1999/xlink")
        .attr("xlink:href", function (d) {
            return d.objectImage;
        })

    bubbleChart.append("g")
        .selectAll("dot")
        .data(final)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return margin.left
        })
        .attr("cy", function (d) {
            return height / 2 + margin.top
        })
        .attr("r", 8)
        .attr("fill", function (d) {
            return d3.rgb(d.colorValue[0], d.colorValue[1], d.colorValue[2])
            // return `url(#${d.objectID})`
        })
        .transition()
        .duration(1000)
        .attr("cx", function (d) {
            return x(d.date);
        })
        .attr("cy", function (d) {
            return y(d.culture);
        })
        .attr("stroke", "white")
        .style("stroke-width", ".5px")
        .attr("transform", `translate(${margin.left},${margin.top + 35})`)





    d3.selectAll(".domain").remove();

    d3.selectAll("button.btn")
        .on("click", function (d) {
            let selectedOption = d3.select(this).property("value")
            console.log(selectedOption);
            updateChart(selectedOption);
        })




    function updateChart(selected) {

        d3.selectAll("text").remove();
        d3.selectAll("circle").remove();
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


        svg.append("g")
            .attr("class", "xAxis")
            .attr("transform", `translate(${margin.left}, ${height + margin.top})`)
            .call(xAxis)
        svg.append("g")
            .attr("class", "yAxis")
            .call(yAxis)
            .attr("transform", `translate(${margin.left},${margin.top})`)


        bubbleChart.append("g")
            .selectAll("dot")
            .data(final)
            .enter()
            .append("circle")
            .attr("cx", function (d, i) {
                return margin.left
            })
            .attr("cy", function (d) {
                return height / 2 + margin.top
            })
            .attr("r", 8)
            .attr("fill", function (d) {
                return d3.rgb(d.colorValue[0], d.colorValue[1], d.colorValue[2])
            })
            .transition()
            .duration(1000)
            .attr("cx", function (d) {
                return x(d.date);
            })
            .attr("cy", function (d) {
                return y(d[selected]);
            })
            .attr("stroke", "white")
            .style("stroke-width", ".5px")
            .attr("transform", `translate(${margin.left},${margin.top + 35})`)

        d3.selectAll("circle")
            .on("mouseover", function (d) {
                d3.select(this)
                    .style('cursor', 'pointer')
                    .attr("fill", function (d) {
                        return `url(#${d.objectID})`
                    })
                    .attr("r", 30)
                    .raise()
            })

        d3.selectAll("circle")
            .on("mouseout", function (d) {
                d3.select(this)
                    .attr("fill", function (d) {
                        return d3.rgb(d.colorValue[0], d.colorValue[1], d.colorValue[2])

                    })
                    .attr("r", 8)
            })

        d3.selectAll(".domain").remove();
    }


    d3.selectAll("circle")
        .on("mouseover", function (d) {
            d3.select(this)
                .style('cursor', 'pointer')
                .attr("fill", function (d) {
                    return `url(#${d.objectID})`
                })
                .attr("r", 30)
                .raise()
        })

    d3.selectAll("circle")
        .on("mouseout", function (d) {
            d3.select(this)
                .attr("fill", function (d) {
                    return d3.rgb(d.colorValue[0], d.colorValue[1], d.colorValue[2])

                })
                .attr("r", 8)
        })
    bubbleChart.append("text")
        .text("A.D.")
        .attr("transform", `translate(${width + margin.left + 18}, ${height + margin.top + 10})`)
})