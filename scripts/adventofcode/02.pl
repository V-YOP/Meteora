#!/usr/bin/env perl
use v5.36;
use utf8;
use open qw/:std :utf8/;
use File::Basename;
use autodie;
use List::Util qw/sum/;
chdir dirname __FILE__;
open my $input, '<', '01';

my @queue = ();

my $sum = 0;
while (<$input>) {
    chomp;
    if ($_ eq '') {
        push @queue, $sum;
        $sum = 0;
        next;
    }
    $sum += $_;
}
@queue = sort {$a <=> $b} @queue;
@queue = splice @queue, -3, 3;
say sum @queue;

