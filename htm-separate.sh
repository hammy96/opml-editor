source htm-lib.sh


# Create style.css by extracting STYLE section
cat index.htm | fromexc

# | toexc('</style>') > style.css


# Create new index.htm by deleting SCRIPT
#  section and replacing with LINK

# Up to STYLE tag
#cat index.htm | toexc('<style>') > tmp

# STYLE section replacement LINK
#echo '<link rel="stylesheet" href="style.css">' >> tmp

# After STYLE tag
#cat index.htm | fromexc('</style>') >> tmp

#\mv -f tmp index.htm




# NOT USED
# Extract SCRIPT section to script.js
# cat index.htm | fromexc('<script>') | toexc('</script>') > script.js

