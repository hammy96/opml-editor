# lean-removed.awk
# v1
#
# Show lines removed by lean.awk
# Split into HTML CSS JS


# Always show STYLE and SCRIPT lines 
$0=="<style>" || $0=="</style>" || $0=="<script>" || $0=="</script>" {print; getline}


# THIS IS THE CORE LOGIC 

# If end of strip disable flag so not shown
$0=="<!--e-->" || $0=="/*e*/" || $0=="//e" {show=0}

# Display line if flag set
show {print}

# If start of strip enable flag so lines shown
$0=="<!--s-->"  || $0=="/*s*/" || $0=="//s" {show=1}

