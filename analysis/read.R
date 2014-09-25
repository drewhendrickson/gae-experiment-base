# modify this to the location of the raw CSV downloaded from Google App Engine
input_file <- "../exp/data.csv"

# this is the location you want the python parser to write the parsed CSV file
output_file <- "tmp.csv"

# run 'python parser.py input_file output_file' 
system(paste('python parser.py', input_file, output_file))
# should print: Done parsing!

# read the results of parsing into R
parsed_gae_data <- read.csv(file=output_file, header=T, stringsAsFactors=F)

# save data as a compressed RData file
saveRDS(parsed_gae_data, file="gae_data.RData")
