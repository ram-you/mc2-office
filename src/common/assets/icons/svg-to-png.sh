mkdir png;  declare -a res=(12); for f in *.svg; do for r in "${res[@]}"; do mkdir png/${r};inkscape -z -e png/${r}/${f%%.*}.png -w $r $f; done;  done; 


mkdir png;  declare -a res=(16); for f in *.svg; do for r in "${res[@]}"; do mkdir png/${r};inkscape -z -e png/${r}/${f%%.*}.png -w $r $f; done;  done; 