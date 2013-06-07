# read in data from gae export
raw_gae_data <- read.csv(file="raw_data.csv", header=T)

source('JSON_parser_function.R')
# this can take 10+ minutes
d <- parseJSONlist(raw_gae_turk_data[,1])

gae_turk_data <- cbind(raw_gae_turk_data[,2:4], d)

save(gae_turk_data, file="gae_data.RData")
