parseJSONlist <- function(json) {  
  require(RJSONIO)
  require(plyr)
  all <- as.data.frame(fromJSON(I(json[1])))
  print(paste("total rows:", nrow(json)))
  
  for (i in 2:length(json)) {
    if (i %% 100 == 0) { print(i) }
    
    t = json[i]
    t2 = fromJSON(I(t))
    
    tmp <- as.data.frame(t2)
    
    all <- rbind.fill(tmp, all)
  }
  
  return (all)  
}