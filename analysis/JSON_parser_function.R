require(RJSONIO)
require(plyr)

parseJSONlist <- function(json) {  
  print(paste("total rows to parse:", length(json)))

  # read the first row to know the number of columns
  first_row <- data.frame(fromJSON(I(json[1])), 
                          stringsAsFactors=FALSE)
  
  # initialize the data frame for all data to be written
  # pre-allocate all entries with NAs that will be overwritten
  all <- data.frame(matrix(NA, nrow=length(json), ncol=ncol(first_row)), 
                    stringsAsFactors=FALSE)
  names(all) <- names(first_row)
  all[1,] <- first_row
  
  # read and parse all remaining rows
  for (i in 2:length(json)) {
    if (i %% 100 == 0) { print(paste("Processing row:", i)) }
    
    t = json[i]
    t2 = data.frame(fromJSON(I(t)), stringsAsFactors=FALSE)
        
    # check for any row length issues:
    if (ncol(t2) != ncol(all)) {
      print(paste("ERROR! ENTRY", i, "NOT OF THE SAME LENGTH AS OTHER ROWS."))
      return(-1)
    }
    
    # add this row to the full data set
    all[i,] <- t2
  }
  
  return (all)  
}