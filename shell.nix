let
  pkgs = import <nixpkgs-unstable> { };
in
pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_22
    corepack_22
  ];
  shellHook = ''
    onefetch
    echo "Opening nushell..."
    nu
  '';
}