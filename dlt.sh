find . \( -path "./node_modules" -o -path "./dist" -o -path "./build" \) -prune -o \
  -type f \( -name "*.js" -o -name "*.js.map" -o -name "*.d.ts" \) \
  -exec sh -c '
    for f do
      case "$f" in
        *.js.map) base="${f%.js.map}" ;;
        *.d.ts)   base="${f%.d.ts}" ;;
        *.js)     base="${f%.js}" ;;
      esac

      if [ -f "$base.ts" ] || [ -f "$base.tsx" ]; then
        echo "$f"
      fi
    done
  ' sh {} +