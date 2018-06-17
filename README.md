# FreedomCorp-Dashboard

Build data dashboard for FreedomCorp sales team. The company sells wholesale goods to small businesses around the country. They sell bulk orders of electronics, household appliances, construction materials and furniture, to different distributors around the country.

FreedomCorp’s sales force is divided into 4 teams, who each control distribution in their own area:
* North-East
* West
* South
* Midwest
Every day, each team makes phone calls to small businesses in their region, to see if they can sell any of their products to them.  For every call, the company keeps a record of the call duration, the result of the call (if a sale was made, rejected, or if the call was stalled), the dollar value of revenue that the call generated, the category that the sale fell into, and the number of raw units that had been purchased. 

# How to run a project
Set up LocalServer
1. Download and Install node.js
2. Open a terminal or command prompt (on Windows you might need to open the command prompt as admin) In the terminal type: npm install -g http-server
3. From then on just cd to the folder that has the files you want to serve and type: http-server
Then point your browser at http://localhost:8080/freedomcorp.html
# Visualization:
Company is facing tough times . Try to find out which part of business is doing better than others. Company wants to see how call duration, revenue per call, number of units sold changing throughout year.
1. A stacked area chart on the main graph display metrics for revenue, call duration, and units sold, broken down between the different teams.
2. Below,timeline used to brush over a bar chart, stacked area chart can be zooming on by clicking on brush in context area.
3. A donut chart display different company types and  summary data for date range that selected.
4. Three bar charts which should provide summary data in the date range that the user chooses to select.

