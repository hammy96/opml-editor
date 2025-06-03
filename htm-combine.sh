source htm-lib.sh

# Up to STYLE tag
cat index.htm | toexc('<link') > tmp

echo '<style>' >> tmp

# STYLE section
cat style.css >> tmp

echo '</style>' >> tmp

# Rest of index.htm
cat index.htm | fromexc('<link') > tmp


\mv -f tmp index.htm
