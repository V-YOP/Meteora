#!/usr/bin/env perl
use v5.36;
use utf8;
use open qw/:std :utf8/;
use File::Basename;
use autodie;
chdir dirname (__FILE__);
open my $input, '<', '01' or die;

my $max = -1;

my $sum = 0;
while (<$input>) {
    chomp;
    if ($_ eq '') {
        $max = $sum if $sum > $max;
        $sum = 0;
        next;
    }
    $sum += $_;
}
say $max;

