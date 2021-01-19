# D3 : Data Journalism and D3

### (klsisk.github.io/d3-challenge/)

## Background
Utilizing information from the U.S. Census Bureau and the Behavioral Risk Factor Surveillance System, create charts, graphs and interactive visualizations to help understand findings

The data set included is based on 2014 ACS 1-year estimates: https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml. The current data set incldes data on rates of income, obesity, poverty, etc. by state. MOE stands for "margin of error."

## Tasks
### Required: D3 Dabbler
Create a scatter plot between two of the data variables such as Healthcare vs. Poverty or Smokers vs. Age

- Using D3 techniques, create a scatter plot that represents each state with circle elements. You'll code this graphic in the app.js file. Make sure to pull in the data from data.csv by using the d3.csv function.
  - Include state abbreviations in the circles
  - Create and situate your axes and labels to the left and bottom of the chart
  
### Bonus: Impress the Boss 
1. More Data, More Dynamics
Include more demographics and more risk factors. Place additional labels in the scatter plot and give click events so that the users can decide which data to display. Animate the transitions for the circles' locations as well as the range of your axes. Do this for two risk factors for each axis. Or, for an extreme challenge, create three for each axis.

2. Incorporate d3-tip
While the ticks on the axes allow us to infer approximate values for each circle, it's impossible to determine the true value without adding another layer of data. Enter tooltips: developers can implement these in their D3 graphics to reveal a specific element's data when the user hovers their cursor over the element. Add tooltips to your circles and display each tooltip with the data that the user has selected.

![image](https://user-images.githubusercontent.com/69765842/104986167-7d05a380-59e0-11eb-9331-dabc01dc1579.png)

![image](https://user-images.githubusercontent.com/69765842/104986251-a7576100-59e0-11eb-922c-8e0a58e9bc10.png)

